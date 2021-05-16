import { promises as fs } from "fs";
import mkdirp from "mkdirp";

const SRC = "node_modules/feather-icons/dist/icons";
const DST = "dist/feather";
// ls node_modules/feather-icons/dist/icons

/**
 * change hello-world.svg to HelloWorld
 */
function buildComponentName(f) {
  const len = f.length;
  let ret = "";
  let cap = true;
  for (let i = 0; i < len - 4; i++) {
    const a = f[i];
    if (a === "-") {
      cap = true;
      continue;
    }
    if (cap) {
      ret += a.toUpperCase();
      cap = false;
    } else {
      ret += a;
    }
  }
  return ret;
}

const start = `
<script lang="ts">
  export let color = "currentColor";
  export let size = 24;
</script>
`;

async function transform(f) {
  const cnt = await fs.readFile(SRC + "/" + f, "utf8");
  const outputCnt =
    start +
    cnt
      .replace(/width="[\d]+?"/, "width={size}")
      .replace(/height="[\d]+?"/, "height={size}")
      .replace(/stroke="[\w]+?"/, "stroke={color}")
      .trim();
  const outputFilename = buildComponentName(f);
  await fs.writeFile(DST + "/" + outputFilename + ".svelte", outputCnt, "utf8");
}

(async () => {
  mkdirp.sync(DST);
  const files = await fs.readdir(SRC);
  const works = [];
  for (let i = 0; i < files.length; i++) {
    works.push(transform(files[i]));
  }
  await Promise.all(works);
})();
