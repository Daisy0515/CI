/*
 * @Author: your name
 * @Date: 2021-05-11 20:56:23
 * @LastEditTime: 2021-05-11 21:00:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /CI/src/common/oauth/oauthSetting.js
 */
import {oauthHomePageUrl} from "@/setUrl.js"

const homePageUrl = oauthHomePageUrl;

export const githubInfo = {//官方github授权相关的信息
    logo: require("@/assets/img/git/github.jpg"),
    clientId: "3aec007a081933c8a3ad",
    clientSecret: "aa01e4f4fac25aee9439d50293b11305dbfb7b09",
    redirectUrl: homePageUrl + "oauth/github/redirect",
};
export const gitlabInfo = { //官方gitlab授权相关的信息
    logo: require("@/assets/img/git/gitLab.jpg"),
    clientId:"33bd84aec18c5421d67cb1d51b532d88377b0ef361dc6340d41bf6894f120c76",
    clientSecret:"f2a0c9ff48c8b59771386b6cefce4f0b1bc7b5f1f1b1e74abe2ccae9182cc56a",
    redirectUrl:homePageUrl + "oauth/gitlab/redirect",
};
export const giteeInfo = { //官方gitee授权相关的信息
    logo: require("@/assets/img/git/gitee.png"),
    clientId: "292c99a855e7b44d99cde7ed2566d6e644cbda44e73bba3c41f81705e4db2ddb",
    clientSecret: "9533fadf30651cd577fbf5c6a7d536a6d7c6f0141f26b93c8987fccfb44a6bee",
    redirectUrl: homePageUrl + "oauth/gitee/redirect",
};
export const bitbucketInfo = { //官方gitee授权相关的信息
    logo: require("@/assets/img/git/bitbucket.png"),
    clientId: "gsDrMTwAbUtjDRM4nL",
    clientSecret: "RGEc97uTSbCrnuUZgdaZRdK446NpYGmp",
    redirectUrl: homePageUrl + 'oauth/bitbucket/redirect',
};

githubInfo.authUrl = 'https://github.com/login/oauth/authorize?client_id=' + githubInfo.clientId + '&redirect_uri=' + githubInfo.redirectUrl;

gitlabInfo.authUrl = 'https://gitlab.com/oauth/authorize?client_id='+gitlabInfo.clientId + '&redirect_uri=' + gitlabInfo.redirectUrl
    + '&response_type=code' +'&scope=read_api';

giteeInfo.authUrl = 'https://gitee.com/oauth/authorize?client_id='+giteeInfo.clientId + '&redirect_uri=' + giteeInfo.redirectUrl
    + '&response_type=code';

bitbucketInfo.authUrl = 'https://bitbucket.org/site/oauth2/authorize?client_id=' + bitbucketInfo.clientId + '&response_type=code';
