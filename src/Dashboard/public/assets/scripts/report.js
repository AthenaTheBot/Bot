$(document).ready(() => {

    $('#submitButton').click(() => {
        const idInput = $('#formID').val();

        if (!idInput || idInput.length != 18 ||isNaN(idInput)) {

            $('#formID').css('border', '2px solid #860606');
            addWarning('Please specify a valid user id.');
            setTimeout(() => {
                $('#formID').css('border-color', 'transparent'); 
            }, 1500);
            return;
        }
        else {

            $('#formID').css('border', '2px solid green');

            const paragraphInput = $('#formParagraph').val();

            if (!paragraphInput) {

                $('#formParagraph').css('border', '2px solid #860606');
                addWarning('Please specify a valid user id.');
                setTimeout(() => {
                    $('#formParagraph').css('border-color', 'transparent'); 
                }, 1500);
            }
            else {

                $('#formParagraph').css('border', '2px solid green');

                setLoading();

                fetch('/api/report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: idInput,
                        content: paragraphInput
                    })
                })
                .then(res => res.json())
                .then(data => {

                    if (data.status == 200) {

                        setSuccess();
                        return;
                    }
                    else {

                        handleError();
                        return;
                    }

                })
                .catch(err => {

                    console.log(err);

                    handleError();
                    return;
                })
            }
        }
    });
});

let warnCount = 0;
let warnRemoved = 0;

const addWarning = (text) => {

    $('.warnings').append(`
    <p id="warn_` + warnCount + `" class="warn">${text}</p>
    `)

    $(`#warn_${warnCount}`).fadeIn();

    warnCount = warnCount + 1;

    setTimeout(() => {
        
        $(`#warn_${warnRemoved}`).fadeOut();

        setTimeout(() => {
            $(`#warn_${warnRemoved}`).remove();
        }, 1000);

        warnRemoved = warnRemoved + 1;

        if (warnRemoved == warnCount) {
            warnCount = 0;
            warnRemoved = 0;
        }

    }, 5000);
};

const setLoading = () => {

    $('.container').children().remove();

    $('.container').append(`
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
            <div class="bounce4"></div>
        </div>
    `)
}

const handleError = () => {

    $('.container').children().remove();

    $('.container').append(`
        <div class="error">
            <h3>Oh no!</h3>
            <p>It looks like an error occured while trying send your report! Please try again later..</p>
        </div>
    `);
}

const setSuccess = () => {

    $('.container').children().remove();

    $('.container').append(`
    <div class="success">
        <h3>Successfull</h3>
        <p>Yor report has been sent to our administration team! Thank you for reporting.</p>
    </div>
`);
}