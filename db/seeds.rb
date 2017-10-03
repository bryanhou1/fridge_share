# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Fridge.create(name: 'for produce')
Fridge.create(name: 'apt 301')

User.create([
	{email: '1@1.c', password: '12345678', name: "Aaron"},
	{email: '2@2.c', password: '12345678', name: "Shane"}
])

Item.create([
	{name: 'milk', expiration_date: "021717", user_id: 1, fridge_id: 2},
	{name: 'cookie', expiration_date: "030117", user_id: 1, fridge_id: 1 },
	{name: 'eggs', expiration_date: "030117", user_id: 1, fridge_id: 1},
	{name: 'juice', expiration_date: "123117", user_id: 2, fridge_id: 1},
	{name: 'mayo', expiration_date: "011517", user_id: 2, fridge_id: 2}
])
