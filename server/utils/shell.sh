#!/bin/sh

vagrant ssh --command ". /home/vagrant/project_env/bin/activate; cd /vagrant/server/project; /bin/bash; exit" || echo "VM is not running, or no project present!"
