while true
do
  echo 'ping'
  curl comparably-client.herokuapp.com > /dev/null
  curl comparably-auth.herokuapp.com > /dev/null
  curl comparably-list-comparison.herokuapp.com > /dev/null
  curl comparably-load-comparison.herokuapp.com > /dev/null
  curl comparably-item-command.herokuapp.com > /dev/null
  curl comparably-facet-command.herokuapp.com > /dev/null
done
