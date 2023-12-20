const getProjectData = async (slug, id, key) => {
  const res = await fetch(`https://api.changeflow.xtfz.xyz/project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      key,
      project_slug: slug,
    }),
  });
  const data = await res.json();
  return data;
};

module.exports = getProjectData;
