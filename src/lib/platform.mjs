/** Maps a problem URL to the judge's display name. Shared by layouts and rehype plugins. */
const PLATFORMS = [
  [/leetcode\.com/, 'LeetCode'],
  [/geeksforgeeks\.org/, 'GeeksforGeeks'],
  [/interviewbit\.com/, 'InterviewBit'],
  [/(codingninjas\.com|naukri\.com\/code360)/, 'Coding Ninjas'],
  [/hackerrank\.com/, 'HackerRank'],
  [/codeforces\.com/, 'Codeforces'],
  [/projecteuler\.net/, 'Project Euler'],
];

/** @param {string} url */
export function platformOf(url) {
  return PLATFORMS.find(([re]) => re.test(url))?.[1] ?? 'the original site';
}
