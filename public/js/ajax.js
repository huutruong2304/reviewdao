$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/category',
        success: function(data) {
            // $('.navbar-nav').append()
            data.map(ele => {
                $('.navbar-nav').append(`<li class="nav-item"><a class="nav-link" href="/danhmuc/${ele.link}">${ele.name}</a></li>`)
                $('#category').append(`<option value='${ele._id}'>${ele.name}</option>`)
            })

        }
    })
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