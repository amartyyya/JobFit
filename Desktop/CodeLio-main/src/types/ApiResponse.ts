import {Info,Project,User} from "@/model/UserPortfolioInfo"

export interface ApiResponse{

success: boolean;
message:string;
introduction?: string;
experience?: string;
linkedin?: string;
codechef?: string;
codeforces?: string;
github?: string;
leetcode?: string;
gfg?: string;
username?: string;
email?: string;
project?:Array<Project>;
}