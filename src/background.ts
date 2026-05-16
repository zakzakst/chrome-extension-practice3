chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "CREATE_TAB_GROUP") {
    // タブ作成
    const tab1 = await chrome.tabs.create({
      url: "https://github.com",
    });

    const tab2 = await chrome.tabs.create({
      url: "https://www.youtube.com/",
    });

    // グループ化
    const groupId = await chrome.tabs.group({
      tabIds: [tab1.id!, tab2.id!],
    });

    // グループ設定
    await chrome.tabGroups.update(groupId, {
      title: "Work",
      color: "blue",
      collapsed: false,
    });
  }
});
