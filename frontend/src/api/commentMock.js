// Fake DB trong RAM
let COMMENTS = {};

export async function getComments(articleId) {
  await new Promise(r => setTimeout(r, 200));
  return COMMENTS[articleId] ?? [];
}

export async function addComment(articleId, comment) {
  await new Promise(r => setTimeout(r, 200));

  const newCmt = {
    id: Date.now(),
    author: comment.author || "Người dùng",
    text: comment.text,
    createdAt: new Date().toISOString()
  };

  if (!COMMENTS[articleId]) COMMENTS[articleId] = [];
  COMMENTS[articleId].unshift(newCmt);

  return newCmt;
}