class Track {
    constructor(url, trackName, trackAuthor, trackDuration) {
        if (url) {
            this.url = url;
        }
        else {

            throw new Error('Tried to create a track class without specifying track url.');
        }
        this.title = trackName || 'Not Found';
        this.author = trackAuthor || 'Not Found';
        this.duration = trackDuration || '0';
    }
}

module.exports = Track;