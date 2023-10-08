

all:
	sudo sudo docker-compose up --build
up:
	sudo docker-compose up

up-d:
	sudo docker-compose up -d

down:
	sudo docker-compose down

build:
	sudo docker-compose build

rebuild:
	sudo docker-compose build --no-cache

clean:
	sudo docker-compose down --rmi all --volumes

ps:
	sudo docker-compose ps

logs:
	sudo docker-compose logs

logs-f:
	sudo docker-compose logs -f


# restart:
#     sudo docker-compose restart

purne:
	sudo docker system prune

purne-a:
	sudo docker system prune -a
