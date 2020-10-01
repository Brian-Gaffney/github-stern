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

async function getPullRequest(pullRequestNumber: number) {
	const res: PullRequestAPIResponse = await got(
		`https://api.github.com/repos/ONEOKI/http-server/pulls/${pullRequestNumber}`,
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
	const res: PullRequestsAPIResponse = await got(
		'https://api.github.com/repos/ONEOKI/http-server/pulls',
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

async function markPullRequestAsUnmergeable(pullRequestNumber: number) {
	addLabelToPR(pullRequestNumber, mergeConflictsLabel)
}

async function markPullRequestAsMasterMerge(pullRequestNumber: number) {
	addLabelToPR(pullRequestNumber, masterBranchLabel)
}

async function addLabelToPR(pullRequestNumber: number, label: string) {
	console.info(`Adding label "${label}" to PR ${pullRequestNumber}`)

	const res: PullRequestAPIResponse = await got.post(
		`https://api.github.com/repos/ONEOKI/http-server/issues/${pullRequestNumber}/labels`,
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

export {
	getPullRequests,
	getPullRequest,
	markPullRequestAsUnmergeable,
	markPullRequestAsMasterMerge,
}
