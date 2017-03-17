<container role="bullet">
  <% if (data.type === 'hot') { %>
    <sprite role="hot-icon"></sprite>
    <text role="hot-comment"><% data.comment %></text>
  <% } else { %>
    <text role="new-comment"><% data.comment %></text>
  <% } %>
</container>