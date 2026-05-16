import { useEffect, useState, useCallback } from "react";

type BookmarkItem = {
  id: string;
  title: string;
  url?: string;
};

const App = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      const tree = await chrome.bookmarks.getTree();
      const bookmarkBar = tree[0].children?.find(
        (node) => node.title === "ブックマーク バー",
      );
      const tagGroupsFolder = bookmarkBar?.children?.find(
        (node) => node.title === "TAG_GROUPS",
      );
      if (!tagGroupsFolder?.children) return;
      setBookmarks(
        tagGroupsFolder.children.map((bookmark) => ({
          id: bookmark.id,
          title: bookmark.title,
          url: bookmark.url,
        })),
      );
    };
    loadBookmarks();
  }, [setBookmarks]);

  const handleCreateGroup = useCallback(async (bookmark: BookmarkItem) => {
    console.log(bookmark);
    await chrome.runtime.sendMessage({
      type: "CREATE_TAB_GROUP",
    });
  }, []);

  return (
    <div>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <button onClick={() => handleCreateGroup(bookmark)}>
              {bookmark.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
