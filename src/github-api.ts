import dotenv from 'dotenv'
import got, { Response } from 'got'

dotenv.config()

interface PullRequest extends Response {
	url: string
	id: number
	number: number
	state: 'open' | 'closed'
	mergeable: true | false | null
	mergeable_state: 'clean' | 'dirty'
	title: string
}

interface PullRequestAPIResponse extends Response {
	body: PullRequest
}

interface PullRequestsAPIResponse extends Response {
	body: [PullRequest]
}

const token = process.env.GITHUB_AUTH_TOKEN
const mergeConflictsLabel: string = 'Merge conflicts ❗'
const masterBranchLabel: string = '💥 Master PR 💥'

const repo: string = 'ONEOKI/http-server'
const githubApiRoot: string = `https://api.github.com/repos/${repo}`

async function getPullRequest(pullRequestNumber: number) {
	const res: PullRequestAPIResponse = await got(
		`${githubApiRoot}/pulls/${pullRequestNumber}`,
		{
			searchParams: {
				state: 'open',
			},
			responseType: 'json',
			headers: {
				accept: 'application/vnd.github.v3+json',
				authorization: `token ${token}`,
			},
		}
	)

	return res.body
}

async function getPullRequests() {
	const res: PullRequestsAPIResponse = await got(`${githubApiRoot}/pulls`, {
		searchParams: {
			state: 'open',
		},
		responseType: 'json',
		headers: {
			accept: 'application/vnd.github.v3+json',
			authorization: `token ${token}`,
		},
	})

	return res.body
}

async function markPullRequestAsUnmergeable(pullRequestNumber: number) {
	return addLabelToPR(pullRequestNumber, mergeConflictsLabel)
}

async function markPullRequestAsMasterMerge(pullRequestNumber: number) {
	return addLabelToPR(pullRequestNumber, masterBranchLabel)
}

async function addLabelToPR(pullRequestNumber: number, label: string) {
	console.info(`Adding label "${label}" to PR ${pullRequestNumber}`)

	const res: PullRequestAPIResponse = await got.post(
		`${githubApiRoot}/issues/${pullRequestNumber}/labels`,
		{
			json: {
				labels: [label],
			},
			responseType: 'json',
			headers: {
				accept: 'application/vnd.github.v3+json',
				authorization: `token ${token}`,
			},
		}
	)

	return res.body
}

async function markPullRequestAsMergeable(pullRequestNumber: number) {
	return removeLabelFromPR(pullRequestNumber, mergeConflictsLabel)
}

async function removeLabelFromPR(pullRequestNumber: number, label: string) {
	console.info(`Removing label "${label}" from PR ${pullRequestNumber}`)

	const requestRoute = encodeURI(
		`${githubApiRoot}/issues/${pullRequestNumber}/labels/${label}`
	)

	const res: PullRequestAPIResponse = await got.delete(requestRoute, {
		responseType: 'json',
		headers: {
			accept: 'application/vnd.github.v3+json',
			authorization: `token ${token}`,
		},
	})

	return res.body
}

async function addCommentToPR(pullRequestNumber: number, comment: string) {
	console.info(`Adding comment to PR ${pullRequestNumber}`)

	const requestRoute = encodeURI(
		`${githubApiRoot}/issues/${pullRequestNumber}/comments`
	)

	const res: PullRequestAPIResponse = await got.post(requestRoute, {
		json: {
			body: `[BOT 🤖] ${comment}`,
		},
		responseType: 'json',
		headers: {
			accept: 'application/vnd.github.v3+json',
			authorization: `token ${token}`,
		},
	})

	return res.body
}

export {
	getPullRequests,
	getPullRequest,
	markPullRequestAsUnmergeable,
	markPullRequestAsMasterMerge,
	markPullRequestAsMergeable,
	addCommentToPR,
}
