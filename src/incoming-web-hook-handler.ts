import express from 'express'

import {
	markPullRequestAsUnmergeable,
	markPullRequestAsMasterMerge,
} from './github-api'

export default (req: express.Request, res: express.Response) => {
	// Check if this incoming webhook is for a pull request update
	if (!req.body.pull_request) {
		return res.status(201).end()
	}

	const pullRequestNumber = req.body.number
	const mergeable = req.body.pull_request.mergeable
	const mergeableState = req.body.pull_request.mergeable_state
	const destinationBranch = req.body.pull_request.base.ref

	console.log(`PR change webhook handler. PR #${pullRequestNumber}`)

	// Check if the PR has merge conflicts
	if (!mergeable && mergeableState === 'dirty') {
		markPullRequestAsUnmergeable(pullRequestNumber)
	}

	// Check if the PR is going into master
	if (destinationBranch === 'master') {
		markPullRequestAsMasterMerge(pullRequestNumber)
	}

	res.status(200).end()
}
