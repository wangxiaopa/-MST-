;(function () {
    var state = window.MSTConfig.load();

    var profileForm = document.getElementById("profileForm");
    var defaultEngine = document.getElementById("defaultEngine");
    var engineList = document.getElementById("engineList");
    var actionList = document.getElementById("actionList");
    var configText = document.getElementById("configText");
    var message = document.getElementById("message");

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function showMessage(text, isError) {
        message.textContent = text;
        message.style.color = isError ? "#dc2626" : "#1d4ed8";
    }

    function enabledEngines() {
        var enabled = state.searchEngines.filter(function (engine) {
            return engine.enabled;
        });
        return enabled.length ? enabled : state.searchEngines;
    }

    function syncDefaultEngineSelect() {
        var engines = enabledEngines();
        defaultEngine.innerHTML = "";

        engines.forEach(function (engine) {
            var option = document.createElement("option");
            option.value = engine.id;
            option.textContent = engine.name;
            defaultEngine.appendChild(option);
        });

        if (!engines.some(function (engine) { return engine.id === state.defaultEngineId; }) && engines[0]) {
            state.defaultEngineId = engines[0].id;
        }
        defaultEngine.value = state.defaultEngineId;
    }

    function renderProfile() {
        profileForm.elements.name.value = state.profile.name;
        profileForm.elements.title.value = state.profile.title;
        profileForm.elements.subtitle.value = state.profile.subtitle;
        profileForm.elements.placeholder.value = state.profile.placeholder;
        profileForm.elements.background.value = state.profile.background;
        profileForm.elements.accentColor.value = state.profile.accentColor || "#ffffff";
        syncDefaultEngineSelect();
    }

    function renderEngines() {
        engineList.innerHTML = state.searchEngines.map(function (engine, index) {
            return [
                '<article class="item-card" data-index="' + index + '" data-list="searchEngines">',
                '  <div class="item-top">',
                '    <strong>' + escapeHtml(engine.name) + '</strong>',
                '    <label class="check-label"><input type="checkbox" data-field="enabled" ' + (engine.enabled ? "checked" : "") + '> 启用</label>',
                '  </div>',
                '  <div class="item-grid">',
                '    <label>名称<input type="text" data-field="name" value="' + escapeHtml(engine.name) + '"></label>',
                '    <label>图标类名<input type="text" data-field="iconClass" value="' + escapeHtml(engine.iconClass) + '" placeholder="icon-baidu"></label>',
                '    <label class="wide">搜索地址<input type="text" data-field="searchUrl" value="' + escapeHtml(engine.searchUrl) + '" placeholder="https://example.com/search?q={query}"></label>',
                '    <label>首页地址<input type="text" data-field="homeUrl" value="' + escapeHtml(engine.homeUrl) + '" placeholder="https://example.com/"></label>',
                '    <label>配置 ID<input type="text" value="' + escapeHtml(engine.id) + '" disabled></label>',
                '  </div>',
                '  <div class="item-controls">',
                '    <button type="button" class="secondary" data-action="up">上移</button>',
                '    <button type="button" class="secondary" data-action="down">下移</button>',
                '    <button type="button" class="danger" data-action="remove">删除</button>',
                '  </div>',
                '</article>'
            ].join("");
        }).join("");
    }

    function renderActions() {
        actionList.innerHTML = state.quickActions.map(function (action, index) {
            return [
                '<article class="item-card" data-index="' + index + '" data-list="quickActions">',
                '  <div class="item-top">',
                '    <strong>' + escapeHtml(action.name) + '</strong>',
                '    <label class="check-label"><input type="checkbox" data-field="enabled" ' + (action.enabled ? "checked" : "") + '> 启用</label>',
                '  </div>',
                '  <div class="item-grid">',
                '    <label>名称<input type="text" data-field="name" value="' + escapeHtml(action.name) + '"></label>',
                '    <label>类型<select data-field="type">',
                '      <option value="url" ' + (action.type === "url" ? "selected" : "") + '>打开链接</option>',
                '      <option value="bookmark" ' + (action.type === "bookmark" ? "selected" : "") + '>收藏提示</option>',
                '    </select></label>',
                '    <label class="wide">链接地址<input type="text" data-field="url" value="' + escapeHtml(action.url) + '" placeholder="https://... 或 settings.html"></label>',
                '    <label>配置 ID<input type="text" value="' + escapeHtml(action.id) + '" disabled></label>',
                '  </div>',
                '  <div class="item-controls">',
                '    <button type="button" class="secondary" data-action="up">上移</button>',
                '    <button type="button" class="secondary" data-action="down">下移</button>',
                '    <button type="button" class="danger" data-action="remove">删除</button>',
                '  </div>',
                '</article>'
            ].join("");
        }).join("");
    }

    function renderAll() {
        renderProfile();
        renderEngines();
        renderActions();
    }

    function updateListValue(event) {
        var field = event.target.getAttribute("data-field");
        if (!field) {
            return;
        }

        var card = event.target.closest(".item-card");
        var listName = card.getAttribute("data-list");
        var index = Number(card.getAttribute("data-index"));
        var item = state[listName][index];

        item[field] = event.target.type === "checkbox" ? event.target.checked : event.target.value;

        if (listName === "searchEngines") {
            syncDefaultEngineSelect();
        }
    }

    function moveItem(listName, index, direction) {
        var list = state[listName];
        var nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= list.length) {
            return;
        }
        var item = list.splice(index, 1)[0];
        list.splice(nextIndex, 0, item);
    }

    function handleListAction(event) {
        var action = event.target.getAttribute("data-action");
        if (!action) {
            return;
        }

        var card = event.target.closest(".item-card");
        var listName = card.getAttribute("data-list");
        var index = Number(card.getAttribute("data-index"));

        if (action === "remove") {
            state[listName].splice(index, 1);
        } else if (action === "up") {
            moveItem(listName, index, -1);
        } else if (action === "down") {
            moveItem(listName, index, 1);
        }

        if (state.searchEngines.length === 0) {
            state.searchEngines.push(createEngine());
        }

        renderAll();
    }

    function createEngine() {
        return {
            id: window.MSTConfig.createId("engine"),
            name: "新搜索",
            iconClass: "",
            searchUrl: "https://example.com/search?q={query}",
            homeUrl: "",
            enabled: true
        };
    }

    function createAction() {
        return {
            id: window.MSTConfig.createId("action"),
            name: "新入口",
            type: "url",
            url: "https://example.com/",
            enabled: true
        };
    }

    function bindEvents() {
        profileForm.addEventListener("input", function (event) {
            if (event.target.name && event.target.name !== "defaultEngineId") {
                state.profile[event.target.name] = event.target.value;
            }
        });

        defaultEngine.addEventListener("change", function () {
            state.defaultEngineId = defaultEngine.value;
        });

        engineList.addEventListener("input", updateListValue);
        engineList.addEventListener("change", updateListValue);
        engineList.addEventListener("click", handleListAction);
        actionList.addEventListener("input", updateListValue);
        actionList.addEventListener("change", updateListValue);
        actionList.addEventListener("click", handleListAction);

        document.getElementById("addEngine").addEventListener("click", function () {
            state.searchEngines.push(createEngine());
            renderAll();
        });

        document.getElementById("addAction").addEventListener("click", function () {
            state.quickActions.push(createAction());
            renderAll();
        });

        document.getElementById("saveConfig").addEventListener("click", function () {
            state = window.MSTConfig.save(state);
            renderAll();
            showMessage("设置已保存，返回主页即可看到更新。");
        });

        document.getElementById("resetConfig").addEventListener("click", function () {
            if (!confirm("确定恢复默认配置吗？当前浏览器中的个人设置会被清空。")) {
                return;
            }
            state = window.MSTConfig.reset();
            renderAll();
            showMessage("已恢复默认配置。");
        });

        document.getElementById("exportConfig").addEventListener("click", function () {
            configText.value = JSON.stringify(window.MSTConfig.normalize(state), null, 2);
            showMessage("配置已导出到文本框。");
        });

        document.getElementById("importConfig").addEventListener("click", function () {
            try {
                state = window.MSTConfig.save(JSON.parse(configText.value));
                renderAll();
                showMessage("配置已导入并保存。");
            } catch (error) {
                showMessage("导入失败，请检查 JSON 格式。", true);
            }
        });

        document.getElementById("backgroundFile").addEventListener("change", function (event) {
            var file = event.target.files[0];
            if (!file) {
                return;
            }

            var reader = new FileReader();
            reader.onload = function () {
                state.profile.background = reader.result;
                profileForm.elements.background.value = reader.result;
                showMessage("本地背景已载入，点击保存后生效。");
            };
            reader.readAsDataURL(file);
        });
    }

    renderAll();
    bindEvents();
})();
