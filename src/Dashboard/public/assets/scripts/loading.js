const redirectPage = (url, seconds) => {

    setTimeout(() => {

        window.location.replace(url);

    }, seconds * 1000)
};