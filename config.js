;(function (window) {
    var STORAGE_KEY = "mst-homepage-config";

    var DEFAULT_CONFIG = {
        version: 1,
        profile: {
            name: "MST",
            title: "最小生成树MST主页",
            subtitle: "一个简洁的个人搜索主页",
            placeholder: "输入关键词后按回车搜索",
            background: "images/13.jpg",
            accentColor: "#ffffff"
        },
        defaultEngineId: "baidu",
        searchEngines: [
            {
                id: "baidu",
                name: "百度",
                iconClass: "icon-baidu",
                searchUrl: "https://www.baidu.com/s?wd={query}",
                homeUrl: "",
                enabled: true
            },
            {
                id: "google",
                name: "Google",
                iconClass: "icon-google",
                searchUrl: "https://www.google.com.hk/search?q={query}",
                homeUrl: "",
                enabled: true
            },
            {
                id: "bing",
                name: "Bing",
                iconClass: "icon-bing",
                searchUrl: "https://www.bing.com/search?q={query}",
                homeUrl: "",
                enabled: true
            },
            {
                id: "zhihu",
                name: "知乎",
                iconClass: "icon-zhihu",
                searchUrl: "https://www.zhihu.com/search?q={query}",
                homeUrl: "https://www.zhihu.com/",
                enabled: true
            },
            {
                id: "douban",
                name: "豆瓣",
                iconClass: "icon-douban",
                searchUrl: "https://www.douban.com/search?q={query}",
                homeUrl: "https://www.douban.com/",
                enabled: true
            },
            {
                id: "bilibili",
                name: "Bilibili",
                iconClass: "icon-bilibili",
                searchUrl: "https://search.bilibili.com/all?keyword={query}",
                homeUrl: "https://www.bilibili.com/",
                enabled: true
            },
            {
                id: "weixin",
                name: "微信",
                iconClass: "icon-Wechat",
                searchUrl: "https://weixin.sogou.com/weixin?type=2&query={query}",
                homeUrl: "https://weixin.sogou.com/",
                enabled: true
            },
            {
                id: "weibo",
                name: "微博",
                iconClass: "icon-weibo",
                searchUrl: "https://s.weibo.com/weibo?q={query}",
                homeUrl: "https://weibo.com/",
                enabled: true
            }
        ],
        quickActions: [
            {
                id: "bookmark",
                name: "收藏本站",
                type: "bookmark",
                url: "",
                enabled: true
            },
            {
                id: "wallpaper",
                name: "壁纸投稿",
                type: "url",
                url: "https://wj.qq.com/s2/4820014/2c0d/",
                enabled: true
            },
            {
                id: "feedback",
                name: "意见反馈",
                type: "url",
                url: "https://wj.qq.com/s2/4819769/c679/",
                enabled: true
            },
            {
                id: "settings",
                name: "个人设置",
                type: "url",
                url: "settings.html",
                enabled: true
            }
        ]
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function createId(prefix) {
        return (prefix || "item") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
    }

    function asString(value, fallback) {
        if (typeof value !== "string") {
            return fallback;
        }
        return value;
    }

    function normalizeSearchEngine(engine, index) {
        var defaultEngine = DEFAULT_CONFIG.searchEngines[index] || DEFAULT_CONFIG.searchEngines[0];
        var normalized = Object.assign({}, defaultEngine, engine || {});

        normalized.id = asString(normalized.id, createId("engine"));
        normalized.name = asString(normalized.name, defaultEngine.name);
        normalized.iconClass = asString(normalized.iconClass, "");
        normalized.searchUrl = asString(normalized.searchUrl, defaultEngine.searchUrl);
        normalized.homeUrl = asString(normalized.homeUrl, "");
        normalized.enabled = normalized.enabled !== false;

        if (normalized.searchUrl.indexOf("{query}") === -1) {
            normalized.searchUrl += normalized.searchUrl.indexOf("?") === -1 ? "?q={query}" : "&q={query}";
        }

        return normalized;
    }

    function normalizeQuickAction(action, index) {
        var defaultAction = DEFAULT_CONFIG.quickActions[index] || DEFAULT_CONFIG.quickActions[0];
        var normalized = Object.assign({}, defaultAction, action || {});

        normalized.id = asString(normalized.id, createId("action"));
        normalized.name = asString(normalized.name, defaultAction.name);
        normalized.type = normalized.type === "bookmark" ? "bookmark" : "url";
        normalized.url = asString(normalized.url, "");
        normalized.enabled = normalized.enabled !== false;

        return normalized;
    }

    function normalizeConfig(config) {
        var source = config && typeof config === "object" ? config : {};
        var normalized = clone(DEFAULT_CONFIG);

        normalized.profile = Object.assign({}, DEFAULT_CONFIG.profile, source.profile || {});
        normalized.profile.name = asString(normalized.profile.name, DEFAULT_CONFIG.profile.name);
        normalized.profile.title = asString(normalized.profile.title, DEFAULT_CONFIG.profile.title);
        normalized.profile.subtitle = asString(normalized.profile.subtitle, DEFAULT_CONFIG.profile.subtitle);
        normalized.profile.placeholder = asString(normalized.profile.placeholder, DEFAULT_CONFIG.profile.placeholder);
        normalized.profile.background = asString(normalized.profile.background, DEFAULT_CONFIG.profile.background);
        normalized.profile.accentColor = asString(normalized.profile.accentColor, DEFAULT_CONFIG.profile.accentColor);

        normalized.searchEngines = Array.isArray(source.searchEngines)
            ? source.searchEngines.map(normalizeSearchEngine)
            : clone(DEFAULT_CONFIG.searchEngines);
        if (normalized.searchEngines.length === 0) {
            normalized.searchEngines = clone(DEFAULT_CONFIG.searchEngines);
        }
        var hasEnabledEngine = normalized.searchEngines.some(function (engine) {
            return engine.enabled;
        });
        if (!hasEnabledEngine) {
            normalized.searchEngines[0].enabled = true;
        }

        normalized.quickActions = Array.isArray(source.quickActions)
            ? source.quickActions.map(normalizeQuickAction)
            : clone(DEFAULT_CONFIG.quickActions);

        var defaultEngineId = asString(source.defaultEngineId, DEFAULT_CONFIG.defaultEngineId);
        var defaultEngine = normalized.searchEngines.find(function (engine) {
            return engine.id === defaultEngineId && engine.enabled;
        });
        var firstEnabledEngine = normalized.searchEngines.find(function (engine) {
            return engine.enabled;
        });
        normalized.defaultEngineId = (defaultEngine || firstEnabledEngine || normalized.searchEngines[0]).id;

        return normalized;
    }

    function loadConfig() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            return normalizeConfig(raw ? JSON.parse(raw) : DEFAULT_CONFIG);
        } catch (error) {
            console.warn("读取个人配置失败，已使用默认配置。", error);
            return clone(DEFAULT_CONFIG);
        }
    }

    function saveConfig(config) {
        var normalized = normalizeConfig(config);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
    }

    function resetConfig() {
        window.localStorage.removeItem(STORAGE_KEY);
        return clone(DEFAULT_CONFIG);
    }

    window.MSTConfig = {
        storageKey: STORAGE_KEY,
        defaultConfig: clone(DEFAULT_CONFIG),
        createId: createId,
        load: loadConfig,
        save: saveConfig,
        reset: resetConfig,
        normalize: normalizeConfig
    };
})(window);
