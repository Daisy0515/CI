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
    clientId: "519c4c232efafaeb3a36",
    clientSecret: "0a807782e1e0f3911b885c6f9812c8d90b2d7fb8",
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
    clientId: "529a89aec1239469a27ff2e6149cc8adf225b2cf70e2fa86e35bca31835dcf59",
    clientSecret: "18b1cbb3e9c01bd6b4c281ae512959192ce66fd617d93ffa7521a539a7c85158",
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
