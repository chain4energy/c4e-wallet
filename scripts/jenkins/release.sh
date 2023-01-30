#!/bin/bash
LAST_TAG=''
NEW_TAG=''

# Get current last tag
get_last_tag () {
  last_tag=$(git describe --tags $(git rev-list --tags --max-count=1))
  if [ $? != 0 ]
  then
    echo "No tag found. Set last tag value to 'v0.0.0'"
    LAST_TAG=v0.0.0
    return 0
  fi
  LAST_TAG=$last_tag
}

# Get new tag value based on last one and type of release (minor, feature, api)
new_tag_value () {
  tag_input=$1
  release_type=$2
  blockchain_version=$3

  first_section=$(echo $tag_input | cut -d. -f1)
  middle_section=$(echo $tag_input | cut -d. -f2)
  last_section=$(echo $tag_input | cut -d. -f3 | cut -d- -f1)
  rc_section=$(echo $tag_input | cut -d. -f3 | cut -d- -f2)

  first_index=$(echo $first_section | cut -dv -f2)
  middle_index=$middle_section
  last_index=$last_section
  rc_index=$(echo $rc_section | cut -b 3,4)

  case $release_type in
    rc)
      new_tag_value=$first_section.$middle_section.$last_section-rc$((rc_index+1))-"$blockchain_version"
      ;;
    minor)
      new_tag_value=$first_section.$middle_section.$(($last_section+1))-"$blockchain_version"
      ;;
    feature)
      new_tag_value=$first_section.$(($middle_section+1)).0-"$blockchain_version"
      ;;
    api)
      new_tag_value=v$(($first_index+1)).0.0-"$blockchain_version"
      ;;
    *)
      echo "Undefined release type value used $release_type"
      exit 1
      ;;
  esac
  NEW_TAG=$new_tag_value
}

# Create new GIT tag
create_git_tag () {
  new_tag=$1

  git tag -a $new_tag -m "Version $new_tag"
  if [ $? != 0 ]
  then
    echo "Failed to create git tag $new_tag"
    exit 1
  fi
}

# Push GIT tag to repository
push_git_tag () {
  push_tag=$1

  git push origin $push_tag
  if [ $? != 0 ]
  then
    echo "Failed to push git tag $push_tag"
    exit 1
  fi
}

# Replace all old tag occurrences in configs and scripts files with new tag value
replace_old_tag_with_new_tag () {
  new_tag=$1
  current_date=$(date '+%Y-%m-%d %H:%M:%S')

  DEFAULT_FILES_TO_REPLACE_OLD_TAG_INFO=( "./deployments/k8s/overlays/$2/*" "./scripts/jenkins/build_image.sh" "./webapp/.env.*" )

  for i in "${DEFAULT_FILES_TO_REPLACE_OLD_TAG_INFO[@]}"
  do
    for file in $i
    do
      sed -i "s/IMAGE_TAG/$new_tag/g" "$file"
      if [ $? != 0 ]
      then
        echo "Failed to replace IMAGE_TAG with $new_tag in $i"
        exit 1
      fi
      sed -i "s/COMPILATION_DATE/$current_date/g" "$file"
      if [ $? != 0 ]
      then
        echo "Failed to replace COMPILATION_DATE with $current_date in $i"
        exit 1
      fi
    done
  done
}

# Use this function for release (create new tag, replace any old tag occurrences, push tag)
release () {
  if [ -z "$1" ]
  then
    printf "Not enough arguments passed: {RELEASE_TYPE}\nPossible values [\"minor\", \"feature\", \"api\"]\n"
    exit 1
  elif [ -z "$2" ]
  then
    printf "Not enough arguments passed: {ENVIRONMENT}\nPossible values [\"devnet\", \"testnet\", \"mainnet\"]\n"
    exit 1
  elif [ -z "$3" ]
  then
    printf "Not enough arguments passed: {BLOCKCHAIN_VERSION}\nPossible values [\"0.45.9\", \"...\"]\n"
    exit 1
  else
    printf "Get last tag\n"
    get_last_tag

    printf "Get new tag value for RELEASE_TYPE: $1, LAST_TAG: $LAST_TAG\n"
    new_tag_value "$LAST_TAG" "$1" "$3"
    printf "New tag value: $NEW_TAG\n"

    printf "Create new local tag: $NEW_TAG\n"
#    create_git_tag "$NEW_TAG"

    printf "Push local tag: $NEW_TAG to git repository\n"
#    push_git_tag "$NEW_TAG"

    printf "Replace all IMAGE_TAG occurrences in files $DEFAULT_FILES_TO_REPLACE_OLD_TAG_INFO\n"
    new_tag_no_v=$(echo $NEW_TAG | cut -dv -f2)
    replace_old_tag_with_new_tag "$new_tag_no_v" "$2"
  fi
}

# Check if the function exists (bash specific)
if declare -f "$1" > /dev/null
then
  # call arguments verbatim
  "$@"
else
  echo "'$1' is not a known function name" >&2
  exit 1
fi
