#!/bin/bash
# chkconfig: 2345 98 02
#
# description: our chatcat node app startup script
# processname: chatcat
#
### BEGIN INIT INFO
# Provides:
# Required-Start: $local_fs $remote_fs
# Required-Stop: $local_fs $remote_fs
# Should-Start: $network
# Should-Stop: $network
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description: chatcat
# Description: chatcat node app is started
### END INIT INFO

NAME=chatcat
PM2=/usr/bin/pm2
USER=vagrant
APP_HOME="/home/vagrant/chatcat"

export NODE_ENV="test"

get_user_shell() {
    local shell=$(getent passwd ${1:-`whoami`} | cut -d: -f7 | sed -e 's/[[:space:]]*$//')

    if [[ $shell == *"/sbin/nologin" ]] || [[ $shell == "/bin/false" ]] || [[ -z "$shell" ]];
    then
      shell="/bin/bash"
    fi

    echo "$shell"
}

super() {
    local shell=$(get_user_shell $USER)
    su - $USER -s $shell -c "NODE_ENV=$NODE_ENV $*"
}

start() {
    echo "Starting $NAME"
    super $PM2 start $APP_HOME/app.js
}

stop() {
    super $PM2 dump
    super $PM2 delete all
    super $PM2 kill
}

restart() {
    echo "Restarting $NAME"
    stop
    start
}

reload() {
    echo "Reloading $NAME"
    super $PM2 reload all
}

status() {
    echo "Status for $NAME:"
    super $PM2 list
    RETVAL=$?
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    reload)
        reload
        ;;
    force-reload)
        reload
        ;;
    *)
        echo "Usage: {start|stop|status|restart|reload|force-reload}"
        exit 1
        ;;
esac
exit $RETVAL
