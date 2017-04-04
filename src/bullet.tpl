<container role="bullet">
    <% if (type === "hot") { %>
        <text role="hot-comment"><% comment %></text>
    <% } else { %>
        <text role="new-comment"><% comment %></text>
    <% } %>
</container>