# create-public-repo
Sometimes there is a reason why a repo is private. But when you try to expose it to the public you want to use expose certain elements from a base repo.

This command does that for you. It copies the files without the git-history and without folders/files you explicitly exclude.

It uses rsync for copying and expects an `exclude-file` which is similar to a `.gitignore`. Simply a list of files that you don't want to copy from your source folder to your new folder.


## Usage
```
npm install -g create-public-repo
create-public-repo -o path/to/private -d path/to/public -e path/to/exclude/file
``
