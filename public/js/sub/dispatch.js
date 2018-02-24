
var dispatch = {
    setup: function($container) {
        var $table = $container.find("table.route");
        var $message = $container.find(".message");
        var $btnSend = $container.find("button.send");
        var $userName = $container.find(".user-name");
        var $userOffice = $container.find(".user-office");
        var $addError = $container.find(".add-error");
        var $officeInput = $container.find("#dispatch-officeId");

        var officeIdFilter = [];
        var currentUser = null;
        api.user.change(setCurrentUser);
        api.user.self()
            .then(setCurrentUser);

        setupAddButton();
        setupSendButton();

        function setCurrentUser(user) {
            currentUser = user;
            if (user) {
                $userName.text(user.firstname + " " + user.lastname);
                $userOffice.text(user.office_name);

                $officeInput.data("params", {
                    officeId: user.officeId,
                    except: officeIdFilter.concat([user.id]),
                });
            } else {
                $userName.text("");
                $userOffice.text("");
            }
        }

        function setupSendButton() {
            $btnSend.click(function() {
                $btnSend.attr("disabled", true);
                $message.text("");
                UI.clearErrors($container);
                var officeIds = [];
                $table.find("tbody tr").each(function(i) {
                    var id = $(this).data("officeId");
                    officeIds.push(id);
                });
                var doc = {
                    userId: currentUser ? currentUser.id : null,
                    title: $container.find(".title").val(),
                    details: $container.find(".details").val(),
                    officeIds: officeIds,
                    type: getDispatchType(),
                }
                $btnSend.text("sending...");
                api.doc.send(doc, function(resp) {
                    if (resp.errors) {
                        $btnSend.text("Send");
                        $btnSend.attr("disabled", false);
                        UI.showErrors($container, resp.errors);
                    } else {
                        var trackingId = resp.trackingId;
                        var fileInput = $container.find("input[name=attachment]")[0];
                        var file = fileInput.files[0];
                        uploadFile(trackingId, file).then(function() {
                            officeIds.splice(0); // why did I splice here again? seems pointless
                            $message.text("document sent: " + trackingId);
                            $table.find("tbody").html("");
                            $container.find("form")[0].reset();
                            $btnSend.text("Send");
                            $btnSend.attr("disabled", false);

                            util.redirectRoute("view-routes",{
                                trackingId: trackingId,
                            });
                        });
                    }
                });
            });
        }

        function uploadFile(trackingId, file) {
            if (file) {
                $btnSend.text("uploading file...");
                return api.doc.setAttachment({
                    trackingId: trackingId,
                    filename: file.name,
                    filedata: file,
                }).then(function(resp) {
                    if (resp && resp.errors)
                        return UI.showErrors($container, resp.errors);
                });
            } else {
                $btnSend.text("Send");
                $btnSend.attr("disabled", false);
                return Promise.resolve();
            }
        }

        function getDispatchType() {
            return $container.find("input[name=dispatch-type]:checked").val();
        }

        function setupAddButton() {
            var $btn = $container.find("button.add");

            $officeInput.on("complete", function() {
                setTimeout(function() {
                    $addError.text("");

                    if (!$officeInput.val())
                        return;

                    var office = $officeInput.data("object");

                    if (!office) {
                        $addError.text("office not found");
                        return;
                    }
                    $officeInput[0].clear();

                    var $tr = util.jq([
                        "<tr>",
                        " <td class='id'></td>",
                        " <td class='name'></td>",
                        " <td class='action'>",
                        "   <a href='#' class='del'>X</a>",
                        "</td>",
                        "</tr>",
                    ]);
                    officeIdFilter.push(office.id);
                    updateOfficeInputParams();

                    $tr.data("object", office);
                    $tr.data("officeId", office.id);
                    $tr.find(".id").text(office.id);
                    $tr.find(".name").text(office.campus_name + " " + office.name);
                    $tr.find(".del").click(function(e) {
                        util.arrayRemove(officeIdFilter, office.id);
                        updateOfficeInputParams();
                        e.preventDefault();
                        $tr.remove();
                        setOfficeIdParam();
                        checkDestinations();
                    });
                    $table.append($tr);
                    setOfficeIdParam(office.id);
                    checkDestinations();
                })
            });
        }

        function setOfficeIdParam(id) {
            if (id == null) {
                var office = $table.find("tbody tr").last().data("object");
                id = office ? office.id : currentUser.officeId;
            }
            $officeInput.data("params", {
                officeId: id,
                except: officeIdFilter,
            });
        }

        function checkDestinations() {
            var offices = [];
            $table.find("tbody tr").each(function(i) {
                var office = $(this).data("object");
                if (office)
                    offices.push(office);
            });

            var office = offices[offices.length-1];
            if (office && office.gateway && currentUser.id != office.id) {
                $officeInput.attr("disabled", true);
                return;
            }
            $officeInput.attr("disabled", false);
        }

        function updateOfficeInputParams() {
            var userId = currentUser ? currentUser.id : null;
            $officeInput.data("params", {
                except: officeIdFilter.concat([userId]),
            });
        }
    }
}

window.addEventListener("load", function() {
    dispatch.setup($("section#dispatch"));
});

