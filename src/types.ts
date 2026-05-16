export type CreateTabGroupPayload = {
  title: string;
  links: { url: string }[];
  color: chrome.tabGroups.Color;
};
