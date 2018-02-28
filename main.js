document.addEventListener('DOMContentLoaded', () => {
    const dashbord = document.querySelector('.dashbord'); //поле, где рисуем
    const btnReset = document.querySelector('.btn-reset'); //кнопка очистки
    const colorPicker = document.querySelector('.color'); //input для выбора цветов
    const select = document.querySelector('.select');
    let color = '#000000'; //по умолчпнию черный #000000
    let arrX = []; //массив координат по x
    let arrY = []; //массив координат по y
    let counter = 0; //счетчик кликов
    let quantity = 2; //количество линий, которые объединяем
    let animationDuration = 300; //время выполнения анимации
    let frame = 50 // количество кадров

    const animation = (element, lineWidth) => { //принимает эелемент и длину линии
        let start = Date.now(); //вермя начала анимации
        const timer = setInterval(() => {
            let timePassed = Date.now() - start; //сколько идет анимация
            
            if (timePassed > animationDuration) { //если пройденное время больше длительности анимации
                clearInterval(timer);
                timePassed = animationDuration; //пройденное время равно длительности анимации (для верных расчетов)
            }

            if (element.classList.contains('circle')) {
                element.style.opacity = (timePassed / animationDuration).toFixed(2); //анимируем круг
            } else {
                element.style.width = Math.round((timePassed / animationDuration) * lineWidth) + 'px'; //анимируем длину линии
            }
        }, 1000 / frame) //получаем fps
    }

    const createCircle = (e) => {
         //создаем точку
         const circle = document.createElement('div');
         circle.classList.add('circle');
         let posLeft = e.offsetX;
         let posTop = e.offsetY;
         circle.style.left = posLeft + 'px';
         circle.style.top = posTop + 'px';
         circle.style.backgroundColor = color;

         dashbord.appendChild(circle);

        animation(circle); //вызываем анимацию и передаем элемент
    }

    const createLine = (numPoint, lineWidth, angle) => {
        const line = document.createElement('div');

        line.classList.add('line');
        line.style.left = arrX[numPoint] + 9 + 'px';
        line.style.top = arrY[numPoint] + 9 + 'px';  
        line.style.transform = 'rotate(' + angle + 'deg)';   
        line.style.backgroundColor = color;

        dashbord.appendChild(line);

        animation(line, lineWidth); //вызываем анимацию и передаем элемент
    }

    const calcLine = () => {
        //создаем линии
        if (counter >= quantity) {
            for(let i=1; i<=quantity; i++) {
                //вычисляем длину между точками
                let lineWidth = Math.round(Math.sqrt(Math.pow(arrX[quantity] - arrX[i - 1], 2) + Math.pow(arrY[quantity] - arrY[i - 1], 2)));
                //вычисляем угол в градусах
                let angle = (Math.atan((arrY[quantity] - arrY[i - 1]) / (arrX[quantity] - arrX[i - 1])) * (180 / Math.PI)).toFixed(2);
                
                if(arrX[quantity] - arrX[i - 1] > 0) {
                    angle -= 180;
                }
                
                createLine(quantity, lineWidth, angle);
            }
            
            //удаляем не неужные координаты в массиве
            arrX.shift();
            arrY.shift();
        } else {
             //вычисляем длину между точками
            let lineWidth = Math.round(Math.sqrt(Math.pow(arrX[counter] - arrX[counter - 1], 2) + Math.pow(arrY[counter] - arrY[counter - 1], 2)));
            //вычисляем угол в градусах
            let angle = (Math.atan((arrY[counter] - arrY[counter - 1]) / (arrX[counter] - arrX[counter - 1])) * (180 / Math.PI)).toFixed(2);
    
            if(arrX[counter] - arrX[counter - 1] < 0) {
                angle -= 180;
            }
          
            createLine((counter - 1), lineWidth, angle);
        }
    }
    
    dashbord.addEventListener('click', (e) => {
        color = colorPicker.value; //при каждом клике берем значение цвета из input
        createCircle(e);
        arrX.push(e.offsetX);
        arrY.push(e.offsetY);
        calcLine();
        counter++
    })

    btnReset.addEventListener('click', () => {
        dashbord.innerHTML = '';
        arrX = [];
        arrY = [];
        counter = 0;
        quantity = select.value;
    })
})