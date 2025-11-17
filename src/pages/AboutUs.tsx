export function AboutUs() {
    return (
        <div className="px-4 py-6">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Who we are:
                </h3>
                <p className="text-gray-600 text-center">
                    At <em>The Menu</em>, we are committed to providing an easy and efficient platform for restaurant owners to
                    create, customize, and publish their menus quickly and hassle-free. But we don't just focus on restaurant
                    owners; we also ensure that customers can easily access the menus of their favorite restaurants directly from
                    their phones. Our mission is to make the dining experience more accessible for both restaurant owners and
                    customers by offering a platform that allows restaurants to reach their audience digitally while giving
                    customers a seamless way to explore menus before or during their visit. Whether you're a restaurant owner
                    creating your menu or a customer looking to browse, <em>The Menu</em> provides you with the tools and access you
                    need.
                </p>

                <br /><br /><br />

                <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Contact Us:
                </h3>
                <p className="text-gray-600 text-center">
                    If you have any questions or need assistance with our service, don’t hesitate to contact us. We are here to help:
                </p>

                <br />
                
                <address className="text-center">
                    <strong>Email</strong>: <a href="mailto:contact@themenu.com">contact@themenu.com</a><br />
                    <strong>Phone</strong>: +1 234 567 890<br />
                    <strong>Address</strong>: 1234 Culinary Avenue, City, Country
                </address>
            </div>
        </div>
    )
}