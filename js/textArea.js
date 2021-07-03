
        $(document).ready(function() {
            // Default count value 
            var count = 0;
            // textarea max accept 250 characters...
            var maxLength = 250;
            $("textarea").keyup(function() {

                var getTextCount = $(this).val();
                var main = getTextCount.length * 100;
                var valueInPercentage = Math.ceil(main / maxLength);
                var charCount = maxLength - getTextCount.length;

                // set text count value...
                if (getTextCount.length <= maxLength) {
                    $('#count').html(charCount);
                    $('#circle').progressCircle({
                        nPercent: valueInPercentage,
                        showPercentText: false,
                        circleSize: 37,
                        thickness: 6
                    });
                } else {
                    $('#count').html(maxLength - getTextCount.length);
                    $('#error-message').show();

                }
                return false;
            });


            // Display loader on first load...
            $('#circle').progressCircle({
                nPercent: 0,
                showPercentText: false,
                circleSize: 37,
                thickness: 6
            });

        });
 