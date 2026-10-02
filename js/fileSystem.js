class FileSystem {
  constructor() {
    this.fs = {
      'Users': {
        'admin': {
          'Desktop': {},
          'Documents': { 'readme.txt': 'Welcome', 'notes.md': '# Notes' },
          'Downloads': { 'image.jpg': 'binary' },
          'Pictures': { 'wallpaper.jpg': 'binary' },
          'Music': { 'song.mp3': 'binary' },
          'Movies': {}
        }
      },
      'Applications': {},
      'System': {
        'Library': {}
      }
    };
  }

  resolvePath(path) {
    const parts = path.split('/').filter(p => p);
    let current = this.fs;
    for (const part of parts) {
      if (current[part] === undefined) return null;
      current = current[part];
    }
    return current;
  }

  listDirectory(path) {
    const dir = this.resolvePath(path);
    if (typeof dir === 'object') return Object.keys(dir);
    return [];
  }

  createFolder(path, name) {
    const dir = this.resolvePath(path);
    if (dir && typeof dir === 'object') {
      dir[name] = {};
      return true;
    }
    return false;
  }

  createFile(path, name, content) {
    const dir = this.resolvePath(path);
    if (dir && typeof dir === 'object') {
      dir[name] = content;
      return true;
    }
    return false;
  }

  deleteFile(path, name) {
    const dir = this.resolvePath(path);
    if (dir && typeof dir === 'object' && dir[name]) {
      delete dir[name];
      return true;
    }
    return false;
  }
}

const fileSystem = new FileSystem();
export default fileSystem;
