;(function () {
    var config = window.MSTConfig.load();
    var searchInput;

    function getEnabledEngines() {
        return config.searchEngines.filter(function (engine) {
            return engine.enabled;
        });
    }

    function getDefaultEngine() {
        var enabledEngines = getEnabledEngines();
        return enabledEngines.find(function (engine) {
            return engine.id === config.defaultEngineId;
        }) || enabledEngines[0] || config.searchEngines[0];
    }

    function buildSearchUrl(engine, text) {
        var query = encodeURIComponent(text.trim());
        if (!query && engine.homeUrl) {
            return engine.homeUrl;
        }
        return engine.searchUrl.split("{query}").join(query);
    }

    function openSearch(engineId) {
        var engine = config.searchEngines.find(function (item) {
            return item.id === engineId;
        }) || getDefaultEngine();

        if (!engine) {
            alert("还没有配置可用的搜索网站，请先进入个人设置添加。");
            return;
        }

        window.open(buildSearchUrl(engine, searchInput.value), "_blank");
    }

    function runQuickAction(action) {
        if (action.type === "bookmark") {
            alert("可以使用 Ctrl + D 或 Command + D 收藏当前主页。");
            searchInput.focus();
            return;
        }

        if (action.url) {
            window.open(action.url, action.url.indexOf("settings.html") === 0 ? "_self" : "_blank");
        }
    }

    function setText(id, value) {
        var element = document.getElementById(id);
        if (element) {
            element.textContent = value || "";
        }
    }

    function applyProfile() {
        document.title = config.profile.title || "最小生成树MST主页";
        document.body.style.backgroundImage = "url(" + (config.profile.background || "images/13.jpg") + ")";
        document.documentElement.style.setProperty("--accent-color", config.profile.accentColor || "#ffffff");

        setText("profileName", config.profile.name);
        setText("homeTitle", config.profile.title);
        setText("homeSubtitle", config.profile.subtitle);
        searchInput.placeholder = config.profile.placeholder || "输入关键词后按回车搜索";
    }

    function renderSearchEngines() {
        var container = document.getElementById("searchEngines");
        container.innerHTML = "";

        getEnabledEngines().forEach(function (engine) {
            var button = document.createElement("button");
            var icon = document.createElement("span");
            var name = document.createElement("span");

            button.type = "button";
            button.className = "engine-button";
            button.title = engine.name;
            button.setAttribute("aria-label", "使用" + engine.name + "搜索");

            icon.className = "iconfont " + engine.iconClass;
            name.className = "engine-name";
            name.textContent = engine.name;

            button.appendChild(icon);
            button.appendChild(name);
            button.addEventListener("click", function () {
                openSearch(engine.id);
            });
            container.appendChild(button);
        });
    }

    function renderQuickActions() {
        var container = document.getElementById("quickActions");
        container.innerHTML = "";

        config.quickActions
            .filter(function (action) {
                return action.enabled;
            })
            .forEach(function (action) {
                var button = document.createElement("button");
                button.type = "button";
                button.className = "quick-action";
                button.textContent = action.name;
                button.addEventListener("click", function () {
                    runQuickAction(action);
                });
                container.appendChild(button);
            });
    }

    function bindEvents() {
        var form = document.getElementById("searchForm");
        var toggle = document.getElementById("toolbarToggle");
        var quickActions = document.getElementById("quickActions");

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            openSearch(config.defaultEngineId);
        });

        toggle.addEventListener("click", function () {
            var isOpen = quickActions.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    function boot() {
        searchInput = document.getElementById("searchInput");
        applyProfile();
        renderSearchEngines();
        renderQuickActions();
        bindEvents();
        searchInput.focus();
    }

    document.addEventListener("DOMContentLoaded", boot);
})();