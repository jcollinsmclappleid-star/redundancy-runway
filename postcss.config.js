import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const attachGeneratedDeclarationSource = {
  postcssPlugin: "attach-generated-declaration-source",
  Once(root) {
    const source = root.source;
    if (!source) {
      return;
    }

    root.walkDecls((declaration) => {
      declaration.source ??= source;
    });
  },
};

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    attachGeneratedDeclarationSource,
  ],
}
