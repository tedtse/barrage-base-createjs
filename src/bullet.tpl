<container role="bullet">
    <% if (data.type === "hot") { %>
        <text role="hot-comment"><% data.comment %></text>
    <% } else { %>
        <text role="new-comment"><% data.comment %></text>
    <% } %>
</container>