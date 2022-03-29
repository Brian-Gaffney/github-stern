import express from 'express'

import {
	markPullRequestAsUnmergeable,
	markPullRequestAsMasterMerge,
	markPullRequestAsMergeable,
	addCommentToPR,
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
	const pullRequestTitle = req.body.pull_request.title
	const deletionsCount = req.body.pull_request.deletions
	const additionsCount = req.body.pull_request.additions

	console.log(`PR change webhook handler. PR #${pullRequestNumber}`)

	// Check if the PR has merge conflicts
	if (!mergeable && mergeableState === 'dirty') {
		markPullRequestAsUnmergeable(pullRequestNumber)
	}

	if (mergeable && mergeableState === 'clean') {
		markPullRequestAsMergeable(pullRequestNumber)
	}

	// Check if the PR is going into master
	if (destinationBranch === 'master') {
		markPullRequestAsMasterMerge(pullRequestNumber)
	}

	/* Check if PR title includes Jira ticket ID */
	/*
	const hasJiraIDInTitle = /\[DEV-\d+\]/.test(pullRequestTitle) === true
	
	if (!hasJiraIDInTitle) {
		console.log('PR title has no Jira ticket ID.')
		addCommentToPR(pullRequestNumber, "Don't forget the Jira ticket ID in the title!")
	}
	
	if (hasJiraIDInTitle) {
		console.log('PR title does have a Jira ticket ID.')
		addCommentToPR(pullRequestNumber, 'Great job with that Jira ticket ID in the title')
	}
	*/
	
	/* Check if PR has more deletions than additions */
	/*
	if (deletionsCount > additionsCount) {
		console.log('PR has more deletions than additions.')
		addCommentToPR(pullRequestNumber, `Code killer. ${deletionsCount} lines removed.`)
	}
	*/

	res.status(200).end()
}
