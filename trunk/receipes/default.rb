group node[:catalog][:group]

user node[:catalog][:user] do
  group node[:catalog][:group]
  system true
  shell "/bin/bash"
end

artifact_deploy "catalog" do
  version "1.0.0"
  artifact_location "http://dl.dropbox.com/u/31081437/catalog-1.0.0.tar.gz"
  deploy_to "/srv/catalog"
  owner "catalog"
  group "catalog"
  action :deploy
end