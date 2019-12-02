$(document).ready(function() {
    $('.btn-del').click(function(e) {
        $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: "DELETE",
            url: "/post/delete/" + id,
            success: function() {
                console.log('Deleted post id:' + id);
                // $(`post-id='${5de32b00d415c628ac2616e4}`)
                // $(`#${5ddb584fcaaa3f49e049e558}`)
                $('#' + 'post_' + id).remove();
                //  làm cách nào để $ tới phần tử row chứa thành phần bị xóa?????????????
            }
        });
    });
});