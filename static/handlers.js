const addButtonElem = document.querySelector('#add-book-button');
addButtonElem.addEventListener('click', () => {
    if(document.forms[0].dataset.id != '-1')
    {
        document.forms[0].dataset.id = '-1';
        document.forms[0].reset();
        document.querySelector('#confirm-button').value = 'Добавить';
    }
    else if(document.forms[0].style.display == 'none')
        document.forms[0].style.display = '';
    else
        document.forms[0].style.display = 'none';
});

const closeButtonElem = document.querySelector('#close-form-button');
closeButtonElem.addEventListener('click', () => {
    if(document.forms[0].dataset.id != '-1')
    {
        document.forms[0].dataset.id = '-1';
        document.forms[0].reset();
        document.querySelector('#confirm-button').value = 'Добавить';
    }
    document.forms[0].style.display = 'none';
});

document.forms[0].onsubmit = () =>{
    const author = document.querySelector('#author');
    const genre = document.querySelector('#genre');
    const title = document.querySelector('#title');
    const num = document.querySelector('#year');

    if(author.value == '' || genre.value == '' || num.value == '')
    {
        alert('Введите все необходимые данные');
        return false;
    }

    if(document.forms[0].dataset.id == '-1')
    {    
        fetch('/last-id')
        .then(res => res.text())
        .then(result =>{
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${result}</td>
                                <td>${author.value}</td>
                                <td>${title.value}</td>
                                <td>${genre.value}</td>
                                <td>${num.value}</td>
                                <td><input type="button" value="Изменить" 
                                    data-id="${result}" onclick="EditHandler(this)"/></td>
                                <td><input type="checkbox" data-id="${result}"/></td>`;
            document.querySelector('#table-body').append(newRow);
            fetch('/books', 
            {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({id: result, 
                    author: author.value,
                    title: title.value,
                    genre: genre.value,
                    year: num.value})
            });
            document.forms[0].reset();
        });
    }
    else
    {
        fetch('/books', 
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({id: document.forms[0].dataset.id, 
                author: author.value,
                title: title.value,
                genre: genre.value,
                year: num.value})
        });

        const rows = document.querySelector('#table-body').querySelectorAll('tr');
        let i = 0;
        for(; i < rows.length; i++)
            if(rows[i].querySelector('td').innerHTML == document.forms[0].dataset.id)
                break;

        const cells = rows[i].querySelectorAll('td');
        cells[1].innerHTML = author.value;
        cells[2].innerHTML = title.value;
        cells[3].innerHTML = genre.value;
        cells[4].innerHTML = num.value;

        document.forms[0].reset();
        document.forms[0].dataset.id = '-1';
        document.querySelector('#confirm-button').value = 'Добавить';
    }
    return false;
};

const deleteButtonElem = document.querySelector('#delete-book-button');
deleteButtonElem.addEventListener('click', () =>{
    const a = [];
    const rows = document.querySelector('#table-body').querySelectorAll('tr');
    for(let i = 0; i < rows.length; i++)
    {
        const e = rows[i].querySelectorAll('input')[1];
        if(e.checked)
        {
            a.push(e.dataset.id);
            rows[i].remove();
        }
    }

    if(a.length == 0)
    {
        alert('Не выбрано ни одной записи');
        return;
    }
    
    fetch('/books', 
        {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(a)
        });
    
});

function EditHandler(elem)
        {
            document.forms[0].style.display = '';
            document.forms[0].dataset.id = elem.dataset.id;
            document.querySelector('#confirm-button').value = 'Применить';
            const elems = elem.parentElement.parentElement.querySelectorAll('td');
            document.querySelector('#author').value = elems[1].innerHTML;
            document.querySelector('#title').value = elems[2].innerHTML;
            document.querySelector('#genre').value = elems[3].innerHTML;
            document.querySelector('#year').value = elems[4].innerHTML;
        }