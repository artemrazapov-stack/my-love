Как вставлять свои фото

1. Положи фотографии в папку images.
2. Открой index.html.
3. Для главного фото найди блок:
   <div class="photo-placeholder photo-slot" data-img="7.jpg">
   и замени 7.jpg на имя своей фотографии.

4. Для карточек воспоминаний найди кнопки memory-card:
   data-img="1.jpg"
   data-title="Фото 1"
   data-text="Здесь будет описание этой фотографии."

Меняешь только:
- data-img — имя файла фото;
- data-title — заголовок модального окна;
- data-text — текст при клике по карточке;
- подпись внутри <strong> и <small>.

Пример:
<button class="memory-card reveal" data-title="Первая прогулка" data-text="Тут будет история" data-img="progulka.jpg">

Если не хочешь папку images, можно положить фото рядом с index.html — скрипт попробует найти его там автоматически.
