#!/bin/sh

vagrant ssh --command "cd /vagrant/client; /bin/bash; exit" || echo "VM is not running!"
