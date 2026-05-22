#!/usr/bin/env bash
# Processes every ready-for-agent issue through: /tdd → PR → /review-pr → /tdd fix → merge
# Skips issues labeled needs-info or ready-for-human, and issues that already have an open PR.
# Stops when no eligible issues remain.
set -euo pipefail

REPO="HaDuve/Portfolio"

echo "Scanning ${REPO} for ready-for-agent issues..."

while true; do
    # Fetch issues labeled ready-for-agent, excluding HITL labels
    candidates=()
    while IFS= read -r line; do
        candidates+=("$line")
    done < <(
        gh issue list \
            --repo "$REPO" \
            --label ready-for-agent \
            --json number,url,labels \
            --jq '
                .[]
                | select(
                    (.labels | map(.name) | contains(["needs-info"]) | not) and
                    (.labels | map(.name) | contains(["ready-for-human"]) | not)
                  )
                | "\(.number) \(.url)"
            ' | sort -n
    )

    # Drop candidates that are parent issues or already have an open PR
    eligible=()
    for entry in "${candidates[@]:-}"; do
        [[ -z "$entry" ]] && continue
        n="${entry%% *}"
        # Skip parent/epic issues
        is_epic=$(gh issue view "$n" --repo "$REPO" --json labels --jq '[.labels[].name] | contains(["epic"])')
        if [[ "$is_epic" == "true" ]]; then
            echo "Skipping issue #${n} (epic)"
            continue
        fi
        has_pr=$(gh pr list --repo "$REPO" \
            --search "#${n} in:body" \
            --state open --json number --jq 'length')
        [[ "$has_pr" -eq 0 ]] && eligible+=("$entry")
    done

    if [[ ${#eligible[@]} -eq 0 ]]; then
        echo "No eligible issues remaining. Done."
        exit 0
    fi

    first="${eligible[0]}"
    issue_number="${first%% *}"
    issue_url="${first#* }"

    echo ""
    echo "=== Issue #${issue_number} === ${issue_url}"

    # 1. TDD: implement the issue
    echo "[1/5] /tdd ${issue_url}"
    claude -p "/tdd ${issue_url} -- implement it directly, do not ask for plan confirmation" \
        --dangerously-skip-permissions

    # 2. Create PR — continue same session so claude knows the branch
    echo "[2/5] create a PR for this"
    claude --continue -p "create a PR for this" \
        --dangerously-skip-permissions

    # Resolve PR URL via gh (reliable, avoids parsing claude output)
    pr_url=$(gh pr list --repo "$REPO" \
        --search "Closes #${issue_number} in:body" \
        --state open --json url \
        --jq '.[0].url // empty')

    if [[ -z "$pr_url" ]]; then
        echo "ERROR: No open PR found for issue #${issue_number} after step 2. Skipping."
        continue
    fi

    echo "PR: ${pr_url}"

    # 3. Review PR
    echo "[3/5] /review-pr ${pr_url}"
    claude --continue -p "/review-pr ${pr_url}" \
        --dangerously-skip-permissions

    # 4. Fix all blockers, suggestions and nits from the review
    echo "[4/5] /tdd ${pr_url} fix all blockers, suggestions and nits"
    claude --continue -p "/tdd ${pr_url} fix all blockers, suggestions and nits of the reviewer -- implement fixes directly, do not ask for confirmation" \
        --dangerously-skip-permissions

    # 5. Merge into main and delete the feature branch
    echo "[5/5] Merging ${pr_url} into main"
    gh pr merge "$pr_url" --repo "$REPO" --merge --delete-branch --admin

    echo "Done: issue #${issue_number} -> ${pr_url} -> merged"
done
