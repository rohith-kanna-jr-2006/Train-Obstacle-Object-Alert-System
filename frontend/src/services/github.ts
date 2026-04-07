import axios from "axios";

const OWNER = "rohith-kanna-jr-2006";
const REPO = "Train-Obstacle-Object-Alert-System";
const GITHUB_API = `https://api.github.com/repos/${OWNER}/${REPO}/commits`;

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  author: {
    avatar_url: string;
    login: string;
  };
}

export const fetchLatestCommits = async (): Promise<GitHubCommit[]> => {
  try {
    const response = await axios.get(GITHUB_API, {
      params: { per_page: 5 }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub commits:", error);
    return [];
  }
};
