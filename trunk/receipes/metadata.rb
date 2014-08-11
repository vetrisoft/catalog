name             "catalog"
maintainer       "Vetrivel Govindarasu"
maintainer_email "talktovetri@gmail.com"
license          "All rights reserved"
description      "Configure and Deployment of catalog application"
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "1.0"

depends "artifact", "~> 0.10.1"
depends "nodejs", "~> 0.11.0"

supports 'ubuntu', ">= 12.04"