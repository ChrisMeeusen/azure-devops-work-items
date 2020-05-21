const fs = window.require('fs');

export const writeCommitMessage = (filePath: string, workItemString: string) => {
    fs.appendFileSync(filePath, workItemString);
};
