STREAM_NAME = test111

up:
	docker compose up --build -d

down:
	docker compose down

rebuild:
	docker exec api_server sh -c "npm run build && npm run restart"

validate:
	docker exec rtmp sh -c "/usr/local/nginx/sbin/nginx -t"

reload:
	docker exec rtmp sh -c "/usr/local/nginx/sbin/nginx -s reload"

stream:
	ffmpeg -re -stream_loop -1 -i "./video.mp4" -c:v libx264 -preset veryfast -c:a aac -b:a 128k -f flv rtmp://localhost:1935/live/$(STREAM_NAME)