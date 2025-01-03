import fs from 'fs';
import path from 'path';

class EmbedFilePlugin {
  /**
   * Constructor for the plugin.
   * @param {object} options - Plugin options.
   * @param {string} options.filePath - Path to the file to embed.
   * @param {string} [options.moduleId] - Module ID to inject the content under.
   */
  constructor({filePath, moduleId = 'embedded-file-module'}) {
    if (!filePath) {
      throw new Error('EmbedFilePlugin requires a "filePath" option.');
    }
    this.filePath = filePath;
    this.moduleId = moduleId;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('EmbedFilePlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'EmbedFilePlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const absoluteFilePath = path.resolve(this.filePath);
          const fileContent = fs.readFileSync(absoluteFilePath, 'utf8');

          // Inject a module with the file content
          compilation.modules.add({
            identifier: () => this.moduleId,
            buildInfo: {},
            buildMeta: {},
            source: () => `export default ${JSON.stringify(fileContent)};`,
            size: () => fileContent.length,
          });
        },
      );
    });
  }
}

export default EmbedFilePlugin;
