Moralis.Cloud.define("discordAuthUrl", async (request) => {
    const config = await Moralis.Config.get({ useMasterKey: true });
    return (
        `https://discord.com/api/oauth2/authorize?client_id=` +
        config.get("DiscordClientId") +
        `&redirect_uri=https%3A%2F%2Foucy8xsrzlld.usemoralis.com%3A2053%2Fserver%2Ffunctions%2FdiscordVerify%3F_ApplicationId%3DhOQ1UgJQiH4lLPHwOUV6lJuEOitUEO0Q2aQ3RXks&response_type=code&scope=identify`
    );
});

Moralis.Cloud.define("TwitterAuthUrl", async (request) => {
    const config = await Moralis.Config.get({ useMasterKey: true });
    return (
        `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=` +
        config.get("TwitterClientId") +
        `&redirect_uri=https%3A%2F%2Foucy8xsrzlld.usemoralis.com%3A2053%2Fserver%2Ffunctions%2FdiscordVerify%3F_ApplicationId%3DhOQ1UgJQiH4lLPHwOUV6lJuEOitUEO0Q2aQ3RXks&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`
    );
});

Moralis.Cloud.define("RedditAuthUrl", async (request) => {
    const config = await Moralis.Config.get({ useMasterKey: true });
    return (
        `https://www.reddit.com/api/v1/authorize?client_id=` +
        config.get("RedditClientId") +
        `&response_type=code&redirect_uri=https%3A%2F%2Foucy8xsrzlld.usemoralis.com%3A2053%2Fserver%2Ffunctions%2FdiscordVerify%3F_ApplicationId%3DhOQ1UgJQiH4lLPHwOUV6lJuEOitUEO0Q2aQ3RXks&scope=identity`
    );
});

Moralis.Cloud.define("discordVerify", async (request) => {
    const Cloud = Moralis.Cloud;
    // @ts-ignore
    const logger = Cloud.getLogger();
    // logger.info('Request : ' + JSON.stringify(request.params));

    const config = await Moralis.Config.get({ useMasterKey: true });
    logger.info("DiscordClientId : " + config.get("DiscordClientId"));
    const code = request.params.code;
    logger.info("Code : " + code);
    const data = {
        client_id: config.get("DiscordClientId"),
        client_secret: config.get("DiscordClientSecret"),
        grant_type: "authorization_code",
        redirect_uri:
            "https://oucy8xsrzlld.usemoralis.com:2053/server/functions/discordVerify?_ApplicationId=hOQ1UgJQiH4lLPHwOUV6lJuEOitUEO0Q2aQ3RXks",
        code: code,
        scope: "identify",
    };

    Moralis.Cloud.httpRequest({
        method: "POST",
        url: "https://discord.com/api/oauth2/token",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        followRedirects: true,
    }).then(
        function (httpResponse) {
            // success
            const data = httpResponse.data;
            logger.info("Request success : " + JSON.stringify(data));
            return Moralis.Cloud.httpRequest({
                url: "https://discordapp.com/api/v8/users/@me",
                headers: {
                    authorization: `${data.token_type} ${data.access_token}`,
                },
                followRedirects: true,
            }).then(
                function (httpResponse) {
                    // success
                    const data = httpResponse.data;
                    logger.info("Request success : " + JSON.stringify(data));
                    Moralis.Cloud.httpRequest({
                        method: "POST",
                        url: "https://discordapp.com/api/v8/users/@me/channels",
                        body: {
                            recipient_id: data.id,
                        },
                        headers: {
                            authorization: `Bot ${config.get("DiscordBotToken")}`,
                        },
                        followRedirects: true,
                    }).then(
                        function (httpResponse) {
                            // success
                            const data = httpResponse.data;
                            logger.info("Request success : " + JSON.stringify(data));
                            return data;
                        },
                        function (httpResponse) {
                            // error
                            logger.info(
                                "User Request failed : " +
                                    JSON.stringify({
                                        status: httpResponse.status,
                                        data: httpResponse.data,
                                    })
                            );
                        }
                    );
                },
                function (httpResponse) {
                    // error
                    logger.info(
                        "User Request failed : " +
                            JSON.stringify({
                                status: httpResponse.status,
                                data: httpResponse.data,
                            })
                    );
                }
            );
        },
        function (httpResponse) {
            // error
            logger.info(
                "Token Request failed : " +
                    JSON.stringify({
                        status: httpResponse.status,
                        data: httpResponse.data,
                    })
            );
        }
    );
});

Moralis.Cloud.define("twitterVerify", async (request) => {
    // @ts-ignore
    const logger = Moralis.Cloud.getLogger();
    // logger.info('Request : ' + JSON.stringify(request.params));

    const config = await Moralis.Config.get({ useMasterKey: true });
    logger.info("TwitterClientId : " + config.get("TwitterClientId"));
    const code = request.params.code;
    logger.info("Code : " + code);
    const data = {
        client_id: config.get("TwitterClientId"),
        client_secret: config.get("TwitterClientSecret"),
        grant_type: "authorization_code",
        redirect_uri:
            "https://oucy8xsrzlld.usemoralis.com:2053/server/functions/twitterVerify?_ApplicationId=hOQ1UgJQiH4lLPHwOUV6lJuEOitUEO0Q2aQ3RXks",
        code: code,
        scope: "identify",
    };

    Moralis.Cloud.httpRequest({
        method: "POST",
        url: "https://api.twitter.com/2/oauth2/token",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        followRedirects: true,
    }).then(
        function (httpResponse) {
            // success
            const data = httpResponse.data;
            logger.info("Request success : " + JSON.stringify(data));
            Moralis.Cloud.httpRequest({
                url: "https://api.twitter.com/2/users/me",
                headers: {
                    authorization: `${data.token_type} ${data.access_token}`,
                },
                followRedirects: true,
            }).then(
                function (httpResponse) {
                    // success
                    const data = httpResponse.data;
                    logger.info("Request success : " + JSON.stringify(data));
                    Moralis.Cloud.httpRequest({
                        method: "POST",
                        url: "https://api.twitter.com/2/users/followers",
                        body: {
                            recipient_id: data.id,
                        },
                        headers: {
                            authorization: `${data.token_type} ${data.access_token}`,
                        },
                        followRedirects: true,
                    }).then(
                        function (httpResponse) {
                            // success
                            const data = httpResponse.data;
                            logger.info("Request success : " + JSON.stringify(data));
                            return data;
                        },
                        function (httpResponse) {
                            // error
                            logger.info(
                                "User Request failed : " +
                                    JSON.stringify({
                                        status: httpResponse.status,
                                        data: httpResponse.data,
                                    })
                            );
                        }
                    );
                },
                function (httpResponse) {
                    // error
                    logger.info(
                        "User Request failed : " +
                            JSON.stringify({
                                status: httpResponse.status,
                                data: httpResponse.data,
                            })
                    );
                }
            );
        },
        function (httpResponse) {
            // error
            logger.info(
                "Token Request failed : " +
                    JSON.stringify({
                        status: httpResponse.status,
                        data: httpResponse.data,
                    })
            );
        }
    );
});

Moralis.Cloud.define("redditVerify", async (request) => {
    // @ts-ignore
    const logger = Moralis.Cloud.getLogger();
    // logger.info('Request : ' + JSON.stringify(request.params));
    const config = await Moralis.Config.get({ useMasterKey: true });
    logger.info("RedditClientId : " + config.get("RedditClientId"));
    const code = request.params.code;
    logger.info("Code : " + code);
    const data = {
        client_id: config.get("RedditClientId"),
        client_secret: config.get("RedditClientSecret"),
        grant_type: "authorization_code",
        redirect_uri:
            "https://oucy8xsrzlld.usemoralis.com:2053/server/functions/RedditVerify?_ApplicationId=hOQ1UgJQiH4lLPHwOUV6lJuEOitUEO0Q2aQ3RXks",
        code: code,
        scope: "identify",
    };

    Moralis.Cloud.httpRequest({
        method: "POST",
        url: "https://www.reddit.com/api/v1/access_token",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        followRedirects: true,
    }).then(
        function (httpResponse) {
            // success
            const data = httpResponse.data;
            logger.info("Request success : " + JSON.stringify(data));
            Moralis.Cloud.httpRequest({
                url: "https://www.reddit.com/api/v1/me",
                headers: {
                    authorization: `${data.token_type} ${data.access_token}`,
                },
                followRedirects: true,
            }).then(
                function (httpResponse) {
                    // success
                    const data = httpResponse.data;
                    logger.info("Request success : " + JSON.stringify(data));
                    Moralis.Cloud.httpRequest({
                        method: "POST",
                        url: "https://www.reddit.com/api/v1/me/prefs",
                        body: {
                            recipient_id: data.id,
                        },
                        headers: {
                            authorization: `${data.token_type} ${data.access_token}`,
                        },
                        followRedirects: true,
                    }).then(
                        function (httpResponse) {
                            // success
                            const data = httpResponse.data;
                            logger.info("Request success : " + JSON.stringify(data));
                            return data;
                        },
                        function (httpResponse) {
                            // error
                            logger.info(
                                "User Request failed : " +
                                    JSON.stringify({
                                        status: httpResponse.status,
                                        data: httpResponse.data,
                                    })
                            );
                        }
                    );
                },
                function (httpResponse) {
                    // error
                    logger.info(
                        "User Request failed : " +
                            JSON.stringify({
                                status: httpResponse.status,
                                data: httpResponse.data,
                            })
                    );
                }
            );
        },
        function (httpResponse) {
            // error
            logger.info(
                "Token Request failed : " +
                    JSON.stringify({
                        status: httpResponse.status,
                        data: httpResponse.data,
                    })
            );
        }
    );
});
