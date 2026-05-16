import type { CreateTabGroupPayload } from "./types";

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "CREATE_TAB_GROUP") {
    const payload = message.payload as CreateTabGroupPayload;

    // タブ作成
    const tabs = await Promise.all(
      payload.links.map((link) => chrome.tabs.create({ url: link.url })),
    );

    // NOTE: tabIdには一つ以上のnumberである必要があるためasを利用（時間あれば直す）
    const tabIds = tabs.map((tab) => tab.id!) as [number, ...number[]];

    // グループ化
    const groupId = await chrome.tabs.group({
      tabIds,
    });

    // グループ設定
    await chrome.tabGroups.update(groupId, {
      title: payload.title,
      color: payload.color,
      collapsed: false,
    });
  }
});
