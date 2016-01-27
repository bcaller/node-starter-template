#!/bin/bash

heroku buildpacks:clear
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-ruby.git#v142
heroku buildpacks:add heroku/nodejs