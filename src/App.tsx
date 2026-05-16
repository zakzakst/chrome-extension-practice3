import { useCallback, useEffect, useState } from "react";

import type { CreateTabGroupPayload } from "./types";

type BookmarkLink = {
  url: string;
};

type BookmarkFolder = {
  id: string;
  title: string;
  links: BookmarkLink[];
};

const getTagGroups = async (): Promise<
  chrome.bookmarks.BookmarkTreeNode | undefined
> => {
  const tree = await chrome.bookmarks.getTree();
  const bookmarkBar = tree[0].children?.find(
    (node) => node.title === "ブックマーク バー",
  );
  const tagGroupsFolder = bookmarkBar?.children?.find(
    (node) => node.title === "TAG_GROUPS",
  );
  return tagGroupsFolder;
};

const colors = [
  chrome.tabGroups.Color.BLUE,
  chrome.tabGroups.Color.CYAN,
  chrome.tabGroups.Color.GREEN,
  chrome.tabGroups.Color.GREY,
  chrome.tabGroups.Color.ORANGE,
  chrome.tabGroups.Color.PINK,
  chrome.tabGroups.Color.PURPLE,
  chrome.tabGroups.Color.RED,
  chrome.tabGroups.Color.YELLOW,
];

const getColor = (index: number): chrome.tabGroups.Color => {
  const colorIndex = index % colors.length;
  return colors[colorIndex];
};

const App = () => {
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      const tagGroups = await getTagGroups();
      if (!tagGroups?.children) return;

      const folders: BookmarkFolder[] = tagGroups.children.map((tagGroup) => {
        const links: BookmarkLink[] = tagGroup.children
          ? tagGroup.children.map((child) => ({
              url: child.url || "",
            }))
          : [];

        return {
          id: tagGroup.id,
          title: tagGroup.title,
          links,
        };
      });

      setBookmarkFolders(folders);
    };
    loadBookmarks();
  }, [setBookmarkFolders]);

  const handleCreateGroup = useCallback(
    async (bookmarkFolder: BookmarkFolder, index: number) => {
      const message: { type: string; payload: CreateTabGroupPayload } = {
        type: "CREATE_TAB_GROUP",
        payload: {
          title: bookmarkFolder.title,
          links: bookmarkFolder.links,
          color: getColor(index),
        },
      };
      await chrome.runtime.sendMessage(message);
    },
    [],
  );

  return (
    <div className="w-60 p-4">
      <ul className="grid grid-cols-1 gap-1">
        {bookmarkFolders.map((bookmarkFolder, index) => (
          <li key={bookmarkFolder.id}>
            <button
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() => handleCreateGroup(bookmarkFolder, index)}
            >
              {bookmarkFolder.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
