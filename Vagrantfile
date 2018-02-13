# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 2.0.0", "< 2.1.0"
Vagrant.configure("2") do |config|

  config.vm.box = "bento/centos-7.4"
  config.vm.box_check_update = true

  config.vm.network "forwarded_port", guest: 80, host: 8079
  config.vm.network "forwarded_port", guest: 8080, host:8080

  config.vm.provider "virtualbox" do |vb|
    vb.name = "Legible Accounting"
    vb.gui = false
    vb.cpus = 1
    vb.memory = 1024
  end

  config.vm.provision "ansible_local" do |ansible|
    ansible.install = true
    ansible.provisioning_path = "/vagrant/server/provision/"
    ansible.playbook = "configure.yml"
  end

  # During Ansible provisioning, a mounted binding is created from the
  # the virtual machine to the shared folder in order to store the project
  # Node modules in the VM. The following provisioner ensures that this binding
  # is recreated on subsequent boots of the VM.
  config.vm.provision "shell", privileged: true, run: "always" do |shell|
    shell.inline = "mount --bind /home/vagrant/node_modules /vagrant/client/node_modules"
  end

end
